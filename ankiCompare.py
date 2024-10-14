import re
import sys
import os

cwd = os.getcwd()
seriesD = cwd+"/series/"
yearsD = cwd+"/years/"


def anki_compare(file):
    addF = open(seriesD+file, encoding='utf-8')
    p = re.compile(r"\d{4}")
    count = 0  # 写入
    t = 0  # 总数
    et = 0  # 已有
    noFileT = 0  # 无文件
    for line in addF:
        t += 1
        data = line.split(';')
        year = p.match(data[1]).group()
        mid = data[0]
        checkFp = re.compile(year + r"(\.\d+)*\.txt")
        exList = []  # 匹配存在目录
        exContent = ""  # 合并检查内容
        writePath = ""  # 写入目标
        cwdFs = os.listdir(yearsD)
        for cwdF in cwdFs:
            if checkFp.match(cwdF):
                checkPath = yearsD + cwdF
                if checkPath not in exList:
                    exList.append(checkPath)
        exFileN = len(exList)
        if exFileN != 0:
            up500 = 0
            for exF in exList:
                if os.path.isfile(exF):
                    with open(exF) as exOp:
                        lin = len(exOp.readlines())
                    with open(exF) as exRp:
                        exContent += exRp.read()
                    if len(writePath) == 0 and lin < 500:
                        writePath += exF
                    if lin >= 500:
                        up500 += 1
            if up500 == exFileN and mid not in exContent:
                writePath += f"{yearsD}{year}.{exFileN}.txt"
                newT = open(writePath, "x")
                newT.write(line)
                newT.close()
                count += 1
                print(f"write {mid} to {writePath}")
            elif mid not in exContent and writePath != "":
                read = open(writePath)
                newL = open(writePath, "a")
                rCon = read.read()
                if not rCon.endswith("\n") and len(rCon) > 0:
                    newL.write("\n")
                else:
                    newL.write(line)
                read.close()
                newL.close()
                count += 1
                print(f"write {mid} to {writePath}")
            else:
                et += 1
                print(f"{mid} In file {year}")
        else:
            noFileT += 1
            print(f"{mid} no file {year}")
    print(f"total {t},wrote {count},exist {et},no file {noFileT}")
    addF.close()


if __name__ == '__main__':
    if len(sys.argv) == 2:
        fPath = sys.argv[1]
        anki_compare(fPath)
    else:
        print(sys.argv)
    sys.exit()
