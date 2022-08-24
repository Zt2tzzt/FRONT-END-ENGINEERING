# Git 远程仓库管理

远程仓库的交互，，

- 从远程仓库 clone 代码：将存储库克隆到新创建的目录中； 

  ```shell
  git clone [url]
  ```

## 推送代码到远程仓库

- 将代码 push 到远程仓库：将本地仓库的代码推送到远程仓库中； 
	
- 默认情况下是将当前分支（如 master）push 到 origin 远程仓库的；
	
	```shell
	git push
	git push origin master
	```

## 拉取远程仓库代码

- 从远程仓库 fetch 代码：从远程仓库获取最新的代码 
	
- 默认情况下是从 origin 中获取代码；
	
  ```shell
  git fetch
	  git fetch origin
	```
	
	- 获取到代码后默认并没有合并到本地仓库，我们需要通过 merge 来合并； -
	
	  ```shell
	  git merge
	  ```
	
	- 从远程仓库 pull 代码：上面的两次操作有点繁琐，我们可以通过一个命令来操作
	
	  ```shell
	  git pull # 相当于 git fetch + git merge(rebase)
	  ```

## 推送代码到远程仓库遇到的2个问题

当本地分支名与远程分支名不想同时，push 遇到的问题：

- 找不到远程仓库对应的分支，

3个问题以及解决。

- 为本地分支指明要推送的远程分支

  ```shell
  git push origin master:main # 表示把本地 master 分支推送到远程 main 分支。
  git push origin head:main # head 指向 master
  ```

- 为 push 设置 default 行为（push.default），
	
	- 默认值是 simple，表示 push 远程同名的分支，
	
	- 将其改为 upstream，表示 push 本地分支关联跟踪的远程上游分支，然后直接使用 git push 命令，即可 push 成功。
	
    ```shell
      # 此时本地当前分支为 master
      git branch --set-upstream-to=origin main # 将当前分支，与远程的 origin main 分支进行关联跟踪。
      git config push.default upstream # 只在当前仓库配置。
      git push
    ```
	
	- 将其改为 current，表示 push 到远程同名的分支，没有则创建与本地同名的分支。
	
	  ```shell
	  # 此时本地当前分支为 master
	  git config push default.current 
	  git push # 在远程仓库创建了 master 分支，并将本地仓库的 master 分支提交到了该分支
	  ```
	
- 或者换一种写法：

  ```shell
  git checkout --track origin/main # 在本地切换一个新分支 main，并跟踪远程的同名分支
  git checkout main # 以上的简写形式
  ```

-----

## 实际工作中初始化 git 仓库的2种情况

- 项目已有远程仓库。

  1. 克隆仓库

     ```shell
     git clone
     ```

  2. 进行开发

     ```shell
     git add .
     git commit -m "[info]"
     git pull # git fetch & git merge
     git push
     ```

- 项目没有 git 仓库，且需要自己搭建，2种方案：

  - 创建一个远程仓库（**推荐**）。
    1. 在 Git 服务器创建一个仓库。
    2. 重复上文【项目已有远程仓库的操作】

  - 创建一个本地仓库，并推送到远程仓库。

    - 写法一

			```shell
			git remote add origin [url] # 关联一个远程仓库
			git branch -set-upstream-to=origin main # 为本地仓库当前分支建立上游分支，关联远程仓库的 main 分支
			git fetch
			git merge --allow-unrelated-histories
			git push
			```

    - 写法二
    
      ```shell
      git checkout main # 原理参考上文【推送代码到远程仓库遇到的2个问题】
      git push
      # 如果本地当前分支（如 master）不再使用，可删除该分支
      ```
    

-----

常见的开源协议划分，理解图解。

-----

Git 的标签 tag 相关操作。

-----

Git 的提交对象以及原理。

-----

Git 的本地默认分支 maser 分支理解。

-----

Git 本地创建新的分支；Git 提交后本地分支的变化。

-----

创建本地分支同时切换。

-----

Git 本地分支的使用场景；本地分支的开发和合并。合并冲突的解决。

-----

什么是 Git 的工作流？常见的 Git flow。

-----

什么是 Git 的远程分支。

-----

Git 远程分支的管理。

-----

什么是 Git 的 rebase？有什么用？

-----

rebase 和 merge 在开发中的选择。

-----

Git 命令速查表图解。