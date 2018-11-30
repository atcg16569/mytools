#!/usr/bin/env python
def merge(cfile,pfile):
    cnt=open(cfile,encoding='utf-8')
    page=open(pfile)
    clines=cnt.readlines()
    plines=page.readlines()
    cnt.close()
    page.close()
    for i in range(len(clines)):
        clines[i]=clines[i].rstrip()+'\t'+plines[i]
    newc=open(cfile,'w')
    newc.writelines(clines)
    newc.close()
    return
import sys
try:
    merge(sys.argv[1],sys.argv[2])
except:
    print (sys.exc_info()[1])
else:
    print ("Succeed!")
