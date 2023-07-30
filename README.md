# Multiple LLM, multiple questions

This is a suplement to a youtube video
https://youtu.be/P9EHFovtItM

All models need to be specified in the models.json file.
Questions are read from questions.json file.

Outputs in the answers/ directory will be overwriten.

to run the questions:
```
virtualenv env
source env/bin/activate
pip install -r requirements.txt

python evaluate.py # requires all model files to be present
```

to display the results
```
python display.py
```
