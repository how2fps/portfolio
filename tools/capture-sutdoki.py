import sys
from pathlib import Path
sys.dont_write_bytecode=True
sys.path.insert(0,r'C:\Users\heart\SUTDVisualNovel')
import main as m
from tkinter import Tk,Frame,PhotoImage
scenario=sys.argv[1]
root=Tk();root.title('SUTDoki capture - '+scenario);root.geometry('1280x800+20+20')
bg=PhotoImage(file='pictures/start_menu_bg3.png')
if scenario=='start':
 m.goStartMenu(root,bg)
 root.attributes('-fullscreen',False);root.geometry('1280x800+20+20')
elif scenario=='characters':
 frame=Frame(root);frame.pack()
 photos=[PhotoImage(file=p) for p in ['pictures/johnnysin_profile_resized2.png','pictures/JC/JCPP.png','pictures/AdamCmith_Pic/Cover Photo.png','pictures/xiaoming/sad.png']]
 m.showSelectNPCWindow(root,frame,'Alex',[m.JOHNNYSIN,m.JUNGCOOK,m.ADAMCMITH,m.XIAOMING],photos,bg)
 # The source selection screen requests its own minimum size.
 root.geometry('1280x800+20+20')
else:
 route,index={'adam-dialogue':(m.AC,4),'adam-choice':(m.AC,2),'jungcook':(m.JC,1),'xiaoming':(m.XIAO_MING,1)}[scenario]
 raw=route('Alex')[index]
 args=list(raw)+[None]*max(0,7-len(raw))
 if args[2] is None: args[2]=[]
 args[6]=bool(args[6])
 scene=m.txtImgOptNameSndAff(*args[:7]);scene['soundFilePath']=None
 frame=Frame(root);frame.pack()
 m.createScenes(root,frame,[scene],bg)
root.mainloop()
