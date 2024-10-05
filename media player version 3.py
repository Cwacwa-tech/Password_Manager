from PyQt5.QtWidgets import QApplication, QWidget, QPushButton, QHBoxLayout, QVBoxLayout, QSlider, QFileDialog, QStyle, QLabel, QSizePolicy, QSpacerItem, QShortcut
from PyQt5.QtGui import QIcon, QPalette, QColor, QKeySequence
from PyQt5.QtCore import Qt, QUrl, QTime
from PyQt5.QtMultimedia import QMediaPlayer, QMediaContent
from PyQt5.QtMultimediaWidgets import QVideoWidget
import sys
#import vlc
#from ctypes import cast, POINTER
#from comtypes import CLSCTX_ALL
#from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume


class Window(QWidget):
    def __init__(self):
        super().__init__()
        
        self.setWindowIcon(QIcon("Icons/Media-iTunes-icon.ico"))


        #Window Title
        self.setWindowTitle("Media Player")
        self.setGeometry(100, 100, 800, 600)# Set the size of the window
        
        p = self.palette()
        #blue = QColor(0, 0, 255)
        p.setColor(QPalette.Window, Qt.blue)
        self.setPalette(p)

        self.media_player()
        

    def media_player(self):
        self.mediaPlayer = QMediaPlayer(None, QMediaPlayer.VideoSurface)
        videowidget = QVideoWidget()
        videowidget.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Expanding)

        self.openBtn = QPushButton("Open File", self)
        #self.openBtn.setIcon(self.style().standardIcon(QStyle.SP_MediaOpen))
        self.openBtn.setIcon(QIcon("Icons/Open-File-Folder.ico"))
        self.openBtn.clicked.connect(self.open_file)#Trigger#
        self.openBtn.setEnabled(True)
        self.openBtn.setFixedWidth(80)

        self.pauseBtn = QPushButton("Pause", self)
        self.pauseBtn.setEnabled(False)
        self.pauseBtn.setIcon(self.style().standardIcon(QStyle.SP_MediaPause))
        #self.pauseBtn.setIcon(QIcon("pause-circle-outline-icon.ico"))
        self.pauseBtn.clicked.connect(self.pause_media)
        self.pauseBtn.setFixedWidth(80)

        self.stopButton = QPushButton("Stop", self)
        self.stopButton.setEnabled(False)
        self.stopButton.setIcon(self.style().standardIcon(QStyle.SP_MediaStop))
        self.stopButton.clicked.connect(self.stop_media)
        self.stopButton.setFixedWidth(80)

        self.playBtn = QPushButton("Play", self)
        self.playBtn.setEnabled(False)
        self.playBtn.setIcon(self.style().standardIcon(QStyle.SP_MediaPlay))
        #self.playBtn.setIcon(QIcon("play.ico"))
        self.playBtn.clicked.connect(self.play_media)#Trigger#
        self.playBtn.setFixedWidth(80)

        # Media Silder
        self.slider = QSlider(Qt.Horizontal)
        self.slider.setRange(0,0)
        self.slider.sliderMoved.connect(self.set_position)#Trigger#
        self.slider.mousePressEvent = self.slider_mouse_press_event

        # Volume slider
        self.volume_slider = QSlider(Qt.Horizontal)
        self.volume_slider.setFixedWidth(80)
        self.volume_slider.setRange(0, 100)  # Volume range from 0 to 100
        self.volume_slider.setValue(50)  # Set default volume to 50%
        self.volume_slider.valueChanged.connect(self.set_volume)  # Connect slider to volume adjustment

        # Volume label with icon
        self.volume_label = QLabel('50%')
        self.volume_label.setFixedWidth(30)
        volume_icon = QApplication.style().standardIcon(QStyle.SP_MediaVolume)
        self.volume_icon_label = QLabel()
        self.volume_icon_label.setFixedWidth(20)
        self.volume_icon_label.setPixmap(volume_icon.pixmap(16, 16))  # Set the icon size

        # Style the volume slider
        self.volume_slider.setStyleSheet("""
            QSlider::groove:horizontal { 
                height: 12px; 
                background: #444; /* Slider groove color */ 
                margin: 2px 0; /* Vertical margin */ 
                border-radius: 6px; /* Rounded corners for the groove */ 
            } 
            QSlider::handle:horizontal { 
                background: #FF0000; /* Handle color */ 
                width: 24px; /* Increased width for a larger circular handle */
                height: 24px; /* Height set equal to width for circular appearance */
                border-radius: 12px; /* Half of width/height for a perfect circle */ 
                margin: -6px 0; /* Center the handle vertically */ 
            } 
            QSlider::handle:horizontal:hover { 
                background: #FF3333; /* Handle color on hover */ 
            } 
            QSlider::sub-page:horizontal { 
                background: #888; /* Color of the groove before the handle */ 
                border-radius: 6px; /* Rounded corners for the sub-page */ 
            } 
            QSlider::add-page:horizontal { 
                background: #444; /* Color of the groove after the handle */ 
                border-radius: 6px; /* Rounded corners for the add-page */ 
            } 
        """)

        # Labels to show current time and total time
        self.current_time_label = QLabel('00:00')
        self.total_time_label = QLabel('00:00')

        hVolumeBox = QHBoxLayout()
        hVolumeBox.addWidget(self.volume_icon_label)
        hVolumeBox.addWidget(self.volume_label)
        hVolumeBox.addWidget(self.volume_slider)

        hbox = QHBoxLayout()#horizontal box
        hbox.setContentsMargins(0,0,0,0)

        h2box = QHBoxLayout()#horizonatal box
        h2box.setContentsMargins(0,0,0,0)
        hSpacer = QSpacerItem(10, 20, QSizePolicy.Expanding, QSizePolicy.Minimum)  # You can adjust the size as needed
        
        h2box.setAlignment(hVolumeBox, Qt.AlignRight)  # Aligns the volume slider layout to the right
        # Align buttons to the left
        h2box.setAlignment(self.openBtn, Qt.AlignLeft)
        h2box.setAlignment(self.playBtn, Qt.AlignLeft)
        h2box.setAlignment(self.pauseBtn, Qt.AlignLeft)
        h2box.setAlignment(self.stopButton, Qt.AlignLeft)

        h2box.addWidget(self.openBtn)
        h2box.addWidget(self.playBtn)
        h2box.addWidget(self.pauseBtn)
        h2box.addWidget(self.stopButton)
        h2box.addItem(hSpacer)  # Add the spacer item to the layout
        h2box.addLayout(hVolumeBox)
        hbox.addWidget(self.current_time_label)
        hbox.addWidget(self.slider)
        hbox.addWidget(self.total_time_label)

        #vertical box
        vbox = QVBoxLayout()
        vbox.setContentsMargins(0,0,0,0)
        vbox.addWidget(videowidget)
        vbox.addLayout(hbox)
        vbox.addLayout(h2box)

        self.mediaPlayer.setVideoOutput(videowidget)

        self.setLayout(vbox)

        ########   TRIGGERS   #######
        self.mediaPlayer.positionChanged.connect(self.position_changed)
        self.mediaPlayer.durationChanged.connect(self.duration_changed)
        self.mediaPlayer.durationChanged.connect(self.update_time_label)

    def slider_mouse_press_event(self, event):
        if event.button() == Qt.LeftButton:  # Check if the left mouse button is pressed
            # Calculate the new slider position based on the mouse click
            slider_length = self.slider.width()
            click_position = event.pos().x()  # Get the x coordinate of the click
            value = int((click_position / slider_length) * self.slider.maximum())  # Calculate value based on the click position
            self.slider.setValue(value)  # Update the slider value
            self.set_position(value)  # Update the media player's position

    def toggle_play_pause(self):
        if self.mediaPlayer.state() == QMediaPlayer.PlayingState:
            self.pause_media()  # Call pause if playing
        else:
            self.play_media()  # Call play if paused or stopped

    def create_shortcuts(self):
        # Play/Pause shortcut (Space)
        toggle_play_pause_shortcut = QShortcut(QKeySequence("Space"), self)
        toggle_play_pause_shortcut.activated.connect(self.toggle_play_pause)

    def open_file(self):
        filename, _ = QFileDialog.getOpenFileName(self, "Open File")
        if filename != '':
            self.mediaPlayer.setMedia(QMediaContent(QUrl.fromLocalFile(filename)))
            self.playBtn.setEnabled(True)
            self.create_shortcuts()

    def format_time(self, ms):#Convert milliseconds to a readable format hh:mm:ss or mm:ss
        time = QTime(0, 0, 0).addMSecs(ms)
        if ms >= 3600000:  # If the media is 1 hour or longer, show hours
            return time.toString('hh:mm:ss')
        else:
            return time.toString('mm:ss')
        
    # Update the time labels
    def update_time_label(self):
        #time_elapsed = self.mediaPlayer.position() / 1000  # Convert milliseconds to seconds
        duration = self.mediaPlayer.duration() / 1000  # Convert milliseconds to seconds

        #remaining_time = duration - time_elapsed
        self.total_time_label.setText(self.format_time(int(duration * 1000)))  # Convert to int

    
    def position_changed(self, position):
        self.slider.setValue(position)
        self.current_time_label.setText(self.format_time(position))

    def duration_changed(self, duration):
        self.slider.setRange(0, duration)
        
    def set_position(self, position):
        self.mediaPlayer.setPosition(position)

    def play_media(self):
        #self.create_shortcuts()
        if self.mediaPlayer.state() == QMediaPlayer.PausedState:
            self.stopButton.setEnabled(True)
            self.pauseBtn.setEnabled(True)
            self.mediaPlayer.play()

        elif self.mediaPlayer.state() == QMediaPlayer.StoppedState:
            self.stopButton.setEnabled(True)
            self.pauseBtn.setEnabled(True)
            self.mediaPlayer.play()

    def pause_media(self):
        if self.mediaPlayer.state() == QMediaPlayer.PlayingState:
            self.mediaPlayer.pause()

    def stop_media(self):
        if self.mediaPlayer.state() == QMediaPlayer.PlayingState:
            self.mediaPlayer.stop()
        
        elif self.mediaPlayer.state() == QMediaPlayer.PausedState:
            self.mediaPlayer.stop()


    def set_volume(self, value):
        # Set the media player's volume
        self.mediaPlayer.setVolume(value)
        self.volume_label.setText(f'{value}%')  # Update volume display

    #def create_shortcuts(self):
        

########################################################################################################################
#################                               PLAYLIST                               ###################
if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = Window()
    window.show()
    sys.exit(app.exec_())
