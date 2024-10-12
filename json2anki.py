import json
import sys


def json2txt(file, name):
    with open(file, encoding='utf-8') as jsonFile:
        read_list = json.load(jsonFile)
    with open(f'{name}.txt', 'w', encoding='utf-8') as out:
        for page in read_list:
            for movie in page['movies']:
                out.write(movie['id'] + ";" + movie['date'] + "\n")


if __name__ == '__main__':
    if len(sys.argv) == 3:
        rPath = sys.argv[1]
        wName = sys.argv[2]
        json2txt(rPath, wName)
        print(f"{wName} wrote\n")
    else:
        print(sys.argv)
    sys.exit()
