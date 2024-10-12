import re
import sys


def anki_compare(file):
    f = open(file, encoding='utf-8')
    p = re.compile(r"\d{4}")
    for line in f:
        data = line.split(';')
        year = p.match(data[1]).group()
        mid = data[0]
        checkFile = year + ".txt"
        try:
            with open(checkFile) as op:
                checkContent = op.read()
            if mid in checkContent:
                print(f"{mid} in {checkFile}")
            else:
                print(f"{mid} not in {checkFile}")
                wf = open(checkFile, "a")
                if not checkContent.endswith("\n"):
                    wf.write("\n")
                    print("add \\n")
                wf.write(line)
                wf.close()
                print(f"write {mid} to {checkFile}")
        except FileNotFoundError:
            print(f"{checkFile} not existed")


if __name__ == '__main__':
    if len(sys.argv) == 2:
        fPath = sys.argv[1]
        anki_compare(fPath)
    else:
        print(sys.argv)
    sys.exit()
