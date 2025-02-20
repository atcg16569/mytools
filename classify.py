import os
import re
import shutil
import sys

cwd = os.getcwd()
seriesD = cwd + "/series/"
yearsD = cwd + "/years/"
noyearD = "_noyear.txt"


def unique(path):
    with open(path, "r", encoding='utf-8') as r:
        lines = r.readlines()
    ulines = list(set(lines))
    with open(path, "w", encoding='utf-8') as w:
        w.writelines(ulines)


def series_classify(file):
    yt = 0
    nyt = 0
    addF = open(file, encoding='utf-8')
    p = re.compile(r"\d{4}")
    for line in addF:
        if not line.endswith("\n"):
            line += "\n"
        data = line.split(';')
        # mid = data[0]
        # print(data)

        if len(data) > 1:
            year = p.match(data[1]).group()
            wPath = yearsD + year + ".txt"
            with open(wPath, "a", encoding='utf-8') as a:
                a.write(line)
            unique(wPath)
            yt += 1
        else:
            noyPath = os.path.splitext(file)[0] + noyearD
            with open(noyPath, "a", encoding='utf-8') as a:
                a.write(line)
            unique(noyPath)
            nyt += 1

    addF.close()
    shutil.move(file, seriesD)
    print(f"classify {yt},no year {nyt}")


if __name__ == '__main__':
    if len(sys.argv) == 2:
        fPath = sys.argv[1]
        series_classify(fPath)
    else:
        print(sys.argv)
    sys.exit()
