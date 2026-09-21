---
title: How to Talk to LLMs
author: "Imran Nazir"
description: How to Talk to Models
image:
  url: "../../assets/images/how-to-talk-to-models.png"
  alt: A stylised HTMX logo graphic
pubDate: 2025-04-06
tags: [llms, ai, machine-learning]
---

## Introduction  

We all spend far too many hours staring at a screen, prompting massive language models like ChatGPT. But what if you
could run a powerful LLM right on your computer, offline and without compromising privacy? You can — local LLMs are
becoming increasingly accessible and are easier to set up than you might think.  

In this guide we’ll walk through getting started with two handy tools: Ollama for model management and OpenWebUI for a
friendly web interface. The examples use the open‑source Gemma model, which is lightweight enough for most consumer‑grade
machines.

## Setting Up Ollama  

Ollama is the simplest way to run an LLM locally. It handles downloading, installing, and serving the model for you.

1. Get Ollama: Visit <https://ollama.com/> and download the installer for macOS, Linux, or Windows.
2. Install: Run the installer and follow the platform‑specific prompts.
3. Run a model: Open a terminal and execute: ```bash ollama run gemma``` Ollama will fetch the Gemma model (the download is large, so be patient) and start a REPL that shows `>>>`.
4. Test it: At the prompt type a question, e.g. `What is the capital of France?` and watch Ollama respond.
5. Explore other models: List every available model with: ```bash ollama list``` Run any of them by replacing `gemma` with the model name, such as `ollama run llama2`.

**Key takeaway:** Ollama lets you spin up an LLM with a single command, making rapid experimentation effortless.

## Adding a Web UI with OpenWebUI  

The command line works, but a graphical interface is far more convenient. OpenWebUI provides a clean, browser‑based chat UI that connects to your locally running Ollama instance.

### Installation  

```bash
# Install the OpenWebUI Python package
pip install open-webui

# Launch the server
open-webui serve
```

When the server starts you’ll see a URL like `http://127.0.0.1:7860`. Open that address in any browser.

### Configuration  

* Select the model – In the OpenWebUI dashboard choose the model you started with Ollama (Gemma).  
* Specify the Ollama endpoint – If OpenWebUI doesn’t auto‑detect the model, set the URL to `http://localhost:11434` (default Ollama API port).  

You now have a full‑featured chat interface with history, adjustable parameters, and a pleasant UI.

### Useful Tips  

* GPU acceleration If your machine has a compatible GPU and the appropriate drivers, OpenWebUI can offload inference to it for faster responses.
* Parameter tweaking Experiment with *temperature* (creativity) and *max tokens* (response length) in the settings pane to tailor model behavior.

## Resources  

* Ollama – <https://ollama.com/>  
* OpenWebUI – <https://openwebui.com/>  
* Gemma LLM – <https://huggingface.co/google/gemma-7b>  

## Wrap‑up  

You’re now equipped to run a local LLM, query it from a web UI, and fine‑tune its behavior. Local inference gives you speed, privacy, and full control over the models you use. Feel free to experiment with different models, adjust settings, and integrate the setup into your own projects. Happy hacking!