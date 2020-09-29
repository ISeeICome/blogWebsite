# vagrant简介

## Vagrant是什么？不是什么？

&emsp;&emsp;Vagrant是构建在虚拟化技术之上的虚拟机运行环境管理工具。通过Vagrant可以方便实现的对虚拟机的管理，包括建立和删除虚拟机、配置虚拟机运行参数、管理虚拟机运行状态、自动化配置和安装开发环境必须的各类软件、打包和分发虚拟机运行环境等。

&emsp;&emsp;Vagrant的运行，需要依赖某项具体的虚拟化技术。由于VirtualBox是一项开源的虚拟化软件，可以同时在Windows、Linux、Macintosh、SSolaris等操作系统上运行并支持众多对众多操作系统的虚拟化，因此，在Vagrant开发的初期，唯一支持的是VirtualBox。随着虚拟化技术的快速发展，现在已经有了更多的虚拟化技术可供选择。VMware、HyperV、Docker等都已经可以通过Vagrant的管理而工作。Windows的HyperV技术在部分Windows发行版本中的集成，使得Vagrant在“开盒即用”的特性方面前进了一大步。

&emsp;&emsp;因此，Vagrant是虚拟机管理工具，不是某项具体的虚拟化技术。对于各项虚拟化技术而言，Vagrant提供了一套基于配置文件和命令行的管理工具。也正是因为如此，Vagrant完成了对虚拟化技术在一定程度上的封装。这为将虚拟化技术引入到基于桌面运行环境的开发工作流中创造了便利条件。

## 为什么要使用Vagrant？

### 尽可能避免”Work on my machine“错误

&emsp;&emsp;”Work on my machine“错误就是在自己的开发环境下代码测试没有问题。在服务器环境测试不通过。

### 缩短搭建开发环境的时间

Vagrant提供了统一的安装程序配置环境：

使用统一的配置文件（ vagrantfile ）实现对服务器的统一配置。

使用共享文件夹（ shared folder ）实现代码编辑向“服务器”的快速提交

使用软件配置脚本（ Provisioning scripts ）实现服务器上的运行环境的快速建立

拥有标准化的虚拟机分享网络，极大缓解了分享开发环境配置时的网络带宽压力

可以具备一个供安装维护测试使用的可抛弃的服务器端环境。