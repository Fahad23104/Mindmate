from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "openchat/openchat-3.5-1210"

print("Downloading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(model_name, cache_dir="./model")

print("Downloading model...")
model = AutoModelForCausalLM.from_pretrained(model_name, cache_dir="./model")

print("Download complete!")
