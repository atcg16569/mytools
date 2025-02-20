import os
import sys

cwd = os.getcwd()
yearsD = cwd + "/years/"


def check(file):
    onlyCode = []
    newLines = []
    rmc = 0
    with open(file, 'r', encoding='utf-8') as r:
        lines = r.readlines()
    for line in lines:
        if ";" not in line:
            onlyCode.append(line.rstrip())
        else:
            newLines.append(line)
    for code in onlyCode:
        for line in newLines:
            if code in line:
                onlyCode.remove(code)
                rmc += 1
    if rmc > 0:
        with open(file, 'w', encoding='utf-8') as w:
            w.writelines(newLines+onlyCode)
        print(f"write onlycode\n{onlyCode}\nnewlines\n{newLines}")
    else:
        print("not find repeat code")


if __name__ == '__main__':
    if len(sys.argv) == 2:
        fPath = sys.argv[1]
        check(fPath)
    else:
        print(sys.argv)
    sys.exit()
