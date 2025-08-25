## 链接github
[ssh密钥进行github身份验证，ssh公私密钥使用详解，github密钥配置与使用，git密钥使用详解，git入门教程](https://www.bilibili.com/video/BV1dV411G77N?vd_source=89cb973c4467150d3eb28469c0fa7c58)
## 1. 初始化仓库:

git init: 在当前目录创建一个新的 Git 仓库。

## 2. 克隆仓库：

git clone <repository_url>: 从远程仓库克隆代码到本地。

## 3. 查看状态：

git status: 查看当前仓库的状态，包括已修改、已暂存和未跟踪的文件。

## 4. 添加文件到暂存区：

git add <file>: 将指定文件添加到暂存区。
git add .: 将所有已修改和未跟踪的文件添加到暂存区。

## 5. 提交更改：


git commit -m "提交说明": 将暂存区中的更改提交到本地仓库，并附上提交说明。

## 6. 查看提交历史：

git log: 查看提交历史，包括提交哈希值、作者、日期和提交说明。
git log --oneline: 以简洁的单行格式查看提交历史。

## 7. 创建分支 and 查看分支 and 删除分支

git branch <branch_name>: 创建一个新的分支。

git branch: 查看所有本地分支。
git branch -r: 查看所有远程分支。
git branch -a: 查看所有本地和远程分支。


git branch -d <branch_name>: 删除指定分支（已合并的分支）。
git branch -D <branch_name>: 强制删除指定分支（未合并的分支）。


## 8. 切换分支 and 删除分支

git checkout <branch_name>: 切换到指定分支。
git checkout -b <branch_name>: 创建并切换到新的分支。


## 9. 合并分支：

git merge <branch_name>: 将指定分支合并到当前分支。

## 10. 推送到远程仓库：

git push origin <branch_name>: 将本地分支推送到远程仓库。

## 11. 从远程仓库拉取：

git pull origin <branch_name>: 从远程仓库拉取最新代码并合并到本地分支。

# 12. 撤销更改：

git revert <commit_hash>: 撤销指定提交的更改，创建一个新的提交。
git reset --hard <commit_hash>: 将当前分支重置到指定提交，丢弃之后的更改（谨慎使用）。

## 13. 暂存更改：

git stash: 暂存当前工作目录中的更改。
git stash pop: 恢复最近一次暂存的更改。

## 14. 查看差异：

git diff: 查看工作目录中未暂存的更改。
git diff --staged: 查看暂存区中已暂存的更改。


## 15. 链接远端仓库 -- 使用ssh

git remote add origin git@github.com:username/repo.git


## 常用工作流程：

git clone <repository_url>: 克隆远程仓库到本地。
git checkout -b <feature_branch>: 创建并切换到新的功能分支。
修改代码。
git add .: 将更改添加到暂存区。
git commit -m "提交说明": 提交更改到本地仓库。
git push origin <feature_branch>: 将功能分支推送到远程仓库。
创建 Pull Request，请求合并到主分支。
代码审查。
合并 Pull Request。
git pull origin main: 将主分支的最新代码拉取到本地。