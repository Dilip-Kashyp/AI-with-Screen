import multiprocessing
import os
import eel


def start():
    print("Running...............")
    eel.init("UI")
    os.system('start msedge.exe --app="http://localhost:8000/index.html"')
    eel.start('index.html', mode=None, host='localhost', block=True)
        
if __name__ == '__main__':
        p1 = multiprocessing.Process(target=start)
        p1.start()
        p1.join()
        print("system stop")   
        