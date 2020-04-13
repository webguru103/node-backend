# Quikkly Python SDK #

Note: to use this Python SDK, you need the Quikkly core native library.
Please contact david@quikklycodes.com for more information and pricing.

## Install ##

`pip install quikkly-python-sdk`

## Dependencies ##

Python 2.7 or 3.6.

Generating SVG codes has no dependencies besides the qukklycore native library files. Generating PNG and JPEG codes requires installing the ImageMagick library with librsvg support.

Scanning codes from images also requires the `numpy` and `Pillow` Python packages.

## Version History ##

* 3.4.8 - Fix setup.py
* 3.4.7 - Renamed `quikkly-generate-svg.py` to `quikkly-generate-code.py`. Add support for PNG and JPEG output formats if ImageMagick is installed.
* 3.4.6 - Fix compatibility with Quikkly core libs v3.4.5 for scanning.
* 3.4.5 - Update to Quikkly core libs v3.4.5. No Python SDK changes.
* 3.4.3 - Update to Quikkly core libs v3.4.3. No Python SDK changes.
* 3.4.1 - Update to Quikkly core libs v3.4.1. No Python SDK changes.
* 3.3.4 - Update to Quikkly core libs v3.3.4. No Python SDK changes.
* 3.3.2 - Update to Quikkly core libs v3.3.2. No Python SDK changes.
* 3.2.1 - Add support for encoding/decoding data values as alphanumeric strings.
* 3.2.0 - Update to Quikkly core libs v3.2.0, reverting some style changes to templates. No Python SDK changes.
* 3.1.0 - Update to Quikkly core libs v3.1.0, with more styling options and templates. No Python SDK changes.
* 1.0.0 - Support for generating SVG codes, scanning images, plus command-line scripts for both.
* 0.1.0 - First Release.

## Making a Release ##

1. Check that setup.py version has been updated to new version,
2. Check that README.md version history has been updated,
3. Check that quikklycore.py version has been updated to compatible native lib versions,
4. Check that you are in a virtualenv with python3 as default,
5. Run ./pypi-upload.sh
