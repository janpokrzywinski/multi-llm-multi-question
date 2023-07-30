import json
import os
import sys

from llama_cpp import Llama

prompt_templates = {
    "llama2chat": {
        "prompt": "<s>[INST]{preface}{question}[/INST]",
        "stop": "</s>",
        },
    "vicuna": {
        "prompt": "### User:\n{preface}{question}\n### Assistant:\n",
        "stop": "###",
        },
    "vicuna-nohash": {
        "prompt": "USER: {preface}{question}\nASSISTANT:\n",
        "stop": "###",
        },
    }

TEMPERATURES = [0.7, 0.8, 1.0]

with open("models.json") as f:
    MODELS = json.loads(f.read())


with open("questions.json") as f:
    QUESTIONS = json.loads(f.read())


def verify_models():
    for model in MODELS:
        if not os.path.isfile(MODELS[model]["path"]):
            print(f"ERROR: missing model file from {model}")
            sys.exit(1)


def save_results(model, results):
    fn = f"answers/answers-{model}.json"
    with open(fn, "w") as f:
        f.write(json.dumps(results))


def construct_question(question, model):
    preface = "Here is a puzzle from a book. It can be a play on words, logic puzzle, cryptic or any other type of a language puzzle. Solve it and provide a direct answer\n"
    model_template = MODELS[model]["prompt_template"]
    prompt_template = prompt_templates[model_template]
    prompt = prompt_template["prompt"].replace("{question}", question).replace("{preface}", preface)
    stop_sign = prompt_template["stop"]
    return prompt, stop_sign


def main():
    for model in MODELS:
        llm = Llama(
            model_path=MODELS[model]["path"],
            n_gpu_layers=70,
            verbose=False,
            )
        model_results = []
        for question in QUESTIONS:
            prompt, stop_sign = construct_question(f'{question["question"]}', model)
            question_results = {
                "question": question["question"],
                "answers": [],
                "correct_answer": question["answer"]
            }
            for temperature in TEMPERATURES:
                output = llm(
                    prompt,
                    max_tokens=1024,
                    echo=False,
                    stop=[stop_sign],
                    )
                answer = output["choices"][0]["text"]
                llm.reset()
                question_results["answers"].append({temperature: answer})

            model_results.append(question_results)

        save_results(model, model_results)
        del llm


if __name__ == "__main__":
    verify_models()
    main()
