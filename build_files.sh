#!/bin/bash
python3 -m venv .build_venv
. .build_venv/bin/activate
pip install -r requirements.txt
python manage.py collectstatic --noinput