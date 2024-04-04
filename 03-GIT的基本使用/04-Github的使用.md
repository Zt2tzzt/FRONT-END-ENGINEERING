# Github 的使用

## 一、issue 的使用

用户提交 issue 后，会有一个编号，通常在标题处表示为 `#xxx`，表示是第 xxx 个 issue。

仓库拥有者，可以在 issue 右侧，使用 Assignees，为解决 issue 的人员。

解决人员修改代码后，提交信息应使用：`fix: #xxx`，这样，在提交记录里，可以直接链接到 issue 的页面。

## 二、Pull Request 的使用

创建新分支，或 fork 仓库，才能出发 Pull Request。

当新的分支，同步到远程仓库时，就会看到”compare and pull request“的提示。点击，就会进入“open a pull request”页面。

在该页面中，编辑 title，description 后，点击“create pull request”，就能创建一个 pull request 了。

与 issue 一样，创建的 pull request，会有一个编号 `#xxx`，这个编号的计数顺序，是与 issue 共用的。

仓库拥有者，或有相关权限的人员，确认 pull request 没有问题，就可以在 pull request 页面点击“Merge pull request”，将 pull request 合并到主分支 main 上。此时 Github 会自动关闭这条 pull request。然后可以选择顺势点击“Delete branch”删除远程仓库上的被合并的分支。

此时，在本地仓库上，仍然时两个没有合并的分支，切换到 main 分支，执行命令

```shell
git pull
```

将远程的 main 分支，拉取到本地的并合并。然后执行命令：

```shell
git branch -d new-branch
```

删除掉本地创建的新分支即可。

用 fork 触发 pull request，道理与创建新分支触发 pull request 相同。

## 三、release 的使用

Github 上的 release 是 tag 标签的。

点击代码仓库右侧的 releases，进入 releases 页面，再点击“Create a new release“，创建一个发行软件包。

这时，需要指定一个标签，来发行版本。再填写相应的描述，和添加软件发行包的二进制文件（通常是压缩归档文件）即可。
