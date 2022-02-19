# coding: utf-8

# Получает версию из src-tm/main.js.

import re

REGEX = r"\/\/\s*@version\s+(.*)"

file = open("src-tm/main.js", "r").read()
print(re.findall(REGEX, file)[0])
