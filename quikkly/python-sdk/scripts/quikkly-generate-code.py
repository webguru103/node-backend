#!/usr/bin/env python
"""Command-line script for generating Quikkly codes."""
from __future__ import absolute_import, print_function

import argparse
import os
import os.path
import logging
import subprocess
import sys
import tempfile


log = logging.getLogger(__name__)

# Fix Python path if scripts are run without pip-installing the quikklysdk package.
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from quikklysdk import quikkly, quikklycore
from quikklysdk.quikklyutils import parse_hex, parse_alnum


def main():
    parser = argparse.ArgumentParser(description='Generate Quikkly codes in SVG, PNG and other formats.')
    parser.add_argument('--native-libs-dir', help='Path to quikklycore native libraries. You can also use the QUIKKLY_NATIVE_DIR environment variable.')
    parser.add_argument('--blueprint-file', help='Path to quikklycore blueprint file. Defaults to --native-libs-dir/blueprint_default.json.')

    # Output parameters
    parser.add_argument('--quiet', default=False, action='store_true', help='Avoid logging debug info to stderr.')
    parser.add_argument('--output-format', default='guess', type=valid_format, help='Output format: SVG, PNG or JPEG. If omitted, guessed from --output-file extension.')
    parser.add_argument('--output-file', metavar='FILE', help='Write output to file.')
    parser.add_argument('--output-stdout', default=False, action='store_true', help='Write output to standard out.')
    parser.add_argument('--open-browser', default=False, action='store_true', help='Open output file in a new Google Chrome tab (MacOS only).')

    # Data parameters
    parser.add_argument('--type', required=True, help='Template ID of the code to generate.')
    parser.add_argument('--data', type=int, help='Code ID as a decimal number.')
    parser.add_argument('--data-hex', type=parse_hex, help='Code ID as a hex number.')
    parser.add_argument('--data-alnum', type=parse_alnum, help='Code ID as an alphanumeric (a-z A-Z 0-9) string.')

    # Skin theme parameters
    parser.add_argument('--background-color', metavar='COLOR', help='Background CSS color - as #aabbcc hex, color name or rgb() triple.')
    parser.add_argument('--border-color', metavar='COLOR', help='Border CSS color - as #aabbcc hex, color name or rgb() triple.')
    parser.add_argument('--mask-color', metavar='COLOR', help='Mask CSS color - as #aabbcc hex, color name or rgb() triple.')
    parser.add_argument('--overlay-color', metavar='COLOR', help='Mask CSS color - as #aabbcc hex, color name or rgb() triple.')
    parser.add_argument('--data-colors', action='append', default=[], metavar='COLOR', help='Data dots CSS color - as #aabbcc hex, color name or rgb() triple. Can provide multiple times.')
    parser.add_argument('--image-url', metavar='URL', help='Image URL. Can be a raw data URI like "data:image/png;base64,..."')
    parser.add_argument('--image-file', metavar='FILE', help='Load image from file.')
    parser.add_argument('--image-fit', default='default', type=valid_fit, metavar='FIT', help='How to fit image into its viewbox.')
    parser.add_argument('--logo-url', metavar='URL', help='Logo URL. Can be a raw data URI like "data:image/png;base64,..."')
    parser.add_argument('--logo-file', metavar='FILE', help='Load logo from file, and encode as base64.')
    parser.add_argument('--logo-fit', default='default', type=valid_fit, metavar='FIT', help='How to fit logo into its viewbox.')
    parser.add_argument('--join', default='default', type=valid_join, metavar='JOIN', help='How to join neighbouring dots.')

    args = parser.parse_args()
    check_args(parser, args)

    if not args.quiet:
        logging.basicConfig(level=logging.INFO, stream=sys.stderr, format='%(levelname)s %(module)s:%(lineno)d: %(message)s')

    run_generate(args)


def run_generate(args):
    if args.native_libs_dir:
        quikkly.init(args.native_libs_dir, args.blueprint_file)
    svg_content = quikkly.generate_svg(
        args.type, args.data,
        border_color=args.border_color, background_color=args.background_color,
        mask_color=args.mask_color, overlay_color=args.overlay_color, data_colors=args.data_colors,
        image_url=args.image_url, image_filename=args.image_file, image_fit=args.image_fit,
        logo_url=args.logo_url, logo_filename=args.logo_file, logo_fit=args.logo_fit,
        join=args.join
    )

    if args.output_format == 'svg':
        if args.output_stdout:
            print(svg_content)
        if args.output_file:
            with open(args.output_file, 'w') as f:
                print(svg_content, file=f)
    else:
        img_content = convert_to_image(svg_content, args.output_format)
        if args.output_stdout:
            print(img_content)
        if args.output_file:
            with open(args.output_file, 'wb') as f:
                print(img_content, file=f)

    if args.open_browser:
        subprocess.call('open -a "Google Chrome" "%s"' % args.output_file, shell=True)


def convert_to_image(svg_content, output_format):
    # Check that ImageMagic is installed and supports SVG.
    try:
        found_svg = False
        vout = subprocess.check_output(['convert', '-version'])
        for line in vout.decode('utf-8').split('\n'):
            if line.startswith('Delegates'):
                if 'rsvg' in line:
                    found_svg = True
        if not found_svg:
            raise RuntimeError('ImageMagick is installed, but without SVG support. Please reinstall ImageMagic with librsvg support. Only SVG output is available without that.')
    except subprocess.CalledProcessError:
        raise RuntimeError('ImageMagick library or its "convert" command line tool are not installed. Only SVG output is available without ImageMagick.')

    # Convert using temporary files.
    svgfile = tempfile.NamedTemporaryFile(suffix='.svg', delete=True)
    imgfile = tempfile.NamedTemporaryFile(suffix='.' + output_format, delete=True)
    try:
        print(svg_content, file=svgfile)
        subprocess.check_call(['convert', '-density', '300', '-background', 'none', svgfile.name, imgfile.name])
        img_content = imgfile.read()
        return img_content
    finally:
        svgfile.close()
        imgfile.close()


def check_args(parser, args):
    if not args.output_stdout and not args.output_file:
        parser.error('Should choose either --output-stdout or --output-file or both.')

    if args.output_file:
        if os.path.isdir(args.output_file):
            parser.error('%s is a directory, cannot use as output file.' % args.output_file)

    if args.output_format == 'guess':
        if not args.output_file:
            parser.error('If not using --output-file, then must provide --output-format.')
        args.output_format = guess_format(args.output_file)

    if args.open_browser:
        if not sys.platform.startswith('darwin'):
            parser.error('Opening output in Google Chrome for rendering is currently only supported on MacOS.')
        if not args.output_file:
            parser.error('If using --open-browser, must also use --output-file to have something to open.')

    num_datas = sum(int(bool(d)) for d in [args.data, args.data_hex, args.data_alnum])

    if num_datas < 1:
        parser.error('Must provide --data or --data-hex or --data-alnum.')
    if num_datas > 1:
        parser.error('Must provide only one out of --data and --data-hex and --data-alnum.')

    if args.data_hex:
        args.data = args.data_hex
        args.data_hex = None
    elif args.data_alnum:
        args.data = args.data_alnum
        args.data_alnum = None

    if args.image_url and args.image_file:
        parser.error('Only one out of --image-url and --image-file can be used at the same time.')
    if args.logo_url and args.logo_file:
        parser.error('Only one out of --logo-url and --logo-file can be used at the same time.')


def valid_fit(value):
    fitnames = {
        'default': quikklycore.QC_IMAGE_FIT_DEFAULT,
        'stretch': quikklycore.QC_IMAGE_FIT_STRETCH,
        'meet': quikklycore.QC_IMAGE_FIT_MEET,
        'slice': quikklycore.QC_IMAGE_FIT_SLICE,
    }
    try:
        return fitnames[value]
    except KeyError:
        raise argparse.ArgumentTypeError('Not a valid fit parameter. Accepted values are "default", "stretch", "meet", and "slice".')


def valid_join(value):
    if value == 'default':
        return quikklycore.QC_JOIN_DEFAULT
    elif value == 'none':
        return quikklycore.QC_JOIN_NONE
    else:
        joinsum = 0
        for val in value.split(','):
            joinnames = {
                'horizontal': quikklycore.QC_JOIN_HORIZONTAL,
                'vertical': quikklycore.QC_JOIN_VERTICAL,
                'right': quikklycore.QC_JOIN_DIAGONAL_RIGHT,
                'left': quikklycore.QC_JOIN_DIAGONAL_LEFT,
            }
            try:
                joinsum += joinnames[val]
            except KeyError:
                raise argparse.ArgumentTypeError('Not a valid join parameter. Accepted values are "default", "none", and comma-separated list of "horizontal", "vertical", "right", "left".')
        return joinsum


def valid_format(value):
    if not value or value.lower() not in ['guess', 'svg', 'png', 'jpeg']:
        raise argparse.ArgumentTypeError('Not a valid output format. Accepted values are "guess", "svg", "png", "jpeg".')
    else:
        return value.lower()


def guess_format(filename):
    basename, ext = os.path.splitext(filename)
    ext = ext.lower()
    if ext == '.svg':
        return 'svg'
    elif ext == '.png':
        return 'png'
    elif ext in ['.jpg', '.jpeg']:
        return 'jpeg'
    else:
        raise argparse.ArgumentError('Unable to guess output format from filename "%s".' % filename)


if __name__ == '__main__':
    main()
