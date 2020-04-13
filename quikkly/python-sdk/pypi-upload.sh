#!/bin/bash
echo "CHECK THAT YOU ARE ON THE PYTHON3 VIRTUALENV"
python setup.py sdist upload -r pypi
