unknown filesystem type 'vboxsf'

能识别vboxsf类型的文件系统，是由于未安装VirtualBox增强功能软件

装个插件

vagrant plugin install vagrant-vbguest
重启
vagrant reload --provision
