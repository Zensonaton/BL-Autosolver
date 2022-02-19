# coding: utf-8

# Скрипт для build'инга всего кода для Tampermonkey.

import os
import subprocess

# Билдим Typescript.
print("Compiling Javascript... ", end="")
os.makedirs("out", exist_ok=True)
subprocess.run(["tsc", "--outDir", "out"])
print("ok")

# После создания билда всего кода для Tampermonkey, соединяем файл src-tm/main.js и out/main.js.
print("Merging Javascript... ", end="")
os.makedirs("out-tm", exist_ok=True)
open("out-tm/main.js", "w").write(open("src-tm/main.js").read() + open("out/main.js").read())
print("ok")

print("\nBuild complete!")
