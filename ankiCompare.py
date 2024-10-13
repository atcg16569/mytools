import re
import sys
import os


def anki_compare(file):
    f = open(file, encoding='utf-8')
    p = re.compile(r"\d{4}")
    count = 0
    for line in f:
        data = line.split(';')
        year = p.match(data[1]).group()
        mid = data[0]
        checkFile = year + ".txt"
        checkPath = os.getcwd() + "\\" + checkFile
        if os.path.isfile(checkPath):
            with open(checkFile) as op:
                checkContent = op.read()
            if mid in checkContent:
                print(f"{mid} in {checkFile}")
            else:
                # print(f"{mid} not in {checkFile}")
                with open(checkFile, "a") as wf:
                    if not checkContent.endswith("\n"):
                        wf.write("\n")
                        # print("add \\n")
                    wf.write(line)
                count += 1
                print(f"write {mid} to {checkFile}")
        else:
            print(f"{checkFile} not existed")
    print(f"total wrote {count}")
    f.close()


if __name__ == '__main__':
    if len(sys.argv) == 2:
        fPath = sys.argv[1]
        anki_compare(fPath)
    else:
        print(sys.argv)
    sys.exit()
