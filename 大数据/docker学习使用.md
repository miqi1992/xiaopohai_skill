# docker学习使用

## 安装部署docker
  
### 系统内核升级
使用的centos6.5，需要升级内核
1. 首先查看内核版本
```
uname -a
```

2. 安装elrepo yum源(提供内核更新、硬件驱动等软件源支持)
```
rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org
rpm -Uvh http://www.elrepo.org/elrepo-release-6-8.el6.elrepo.noarch.rpm
```

如果执行第一条语句发现curl: (35) SSL connect error错误，则先执行下面语句：
```
yum update nss
```

3. 修改启动grub.将default改为0：  
```
sudo vim /etc/grub.conf
#boot=/dev/vda
default=0
timeout=5
```

4.重启电脑
```
reboot
```

5、软件更新
```
yum update
```

### docker安装
https://www.cnblogs.com/helloyy/p/6858210.html
