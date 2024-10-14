import re
import sys
import os


def anki_compare(file):
    addF = open(file, encoding='utf-8')
    p = re.compile(r"\d{4}")
    count = 0  # 写入
    t = 0  # 总数
    et = 0  # 已有
    noFileT = 0  # 无文件
    cwd = os.getcwd()
    cwdFs = os.listdir(cwd)
    for line in addF:
        t += 1
        data = line.split(';')
        year = p.match(data[1]).group()
        mid = data[0]
        checkPa = f"{year}(\.\d+)*\.txt"
        checkFp = re.compile(checkPa)
        exList = []  # 匹配存在目录 
        exContent = ""  # 合并检查内容
        writePath = ""  # 写入目标
        for cwdF in cwdFs:
            if checkFp.match(cwdF):
                checkPath = cwd + "/" + cwdF
                if checkPath not in exList:
                    exList.append(checkPath)
        if len(exList) != 0:
            for exF in exList:
                if os.path.isfile(exF):
                    exOp = open(exF)
                    exContent += exOp.read()
                    if len(writePath) == 0 and len(exOp.readlines()) < 500:
                        writePath += exF
                    exOp.close()
            if mid not in exContent and writePath != "":
                read = open(writePath)
                newL = open(writePath, "a")
                if not read.read().endswith("\n"):
                    newL.write("\n")
                else:
                    newL.write(line)
                read.close()
                newL.close()
                count += 1
                print(f"write {mid} to {writePath}")
            else:
                et += 1
                print(f"{mid} in {exList}")
        else:
            noFileT += 1
            print(f"{mid} no file")
    print(f"total {t},wrote {count},exist {et},no file {noFileT}")
    addF.close()


if __name__ == '__main__':
    if len(sys.argv) == 2:
        fPath = sys.argv[1]
        anki_compare(fPath)
    else:
        print(sys.argv)
    sys.exit()
