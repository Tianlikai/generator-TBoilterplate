const Generator = require("yeoman-generator");
const kebabCase = require("@queso/kebab-case");
const chalk = require("chalk");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.REPO_PATH = "https://github.com/Tianlikai/boilerplate-typeScript-reduxFlow.git";
    this.option("name", { type: String, description: "项目名称", alias: "n" });
  }
  async prompting() {
    if (!this.options.name) {
      const { name } = await this.prompt([
        { name: "name", message: "请输入项目名称", type: "input" }
      ]);
      this.args.name = name;
    } else {
      this.args.name = this.options.name || this.args.name;
    }
  }
  writing() {
    const { name } = this.args;
    const cwd = this.destinationPath(name);
    this.spawnCommandSync("git", ["clone", this.REPO_PATH, name]);
    this.fs.extendJSON(this.destinationPath(name, "package.json"), {
      name: kebabCase(name),
      version: "1.0.0",
      description: "",
      repository: "",
      author: `${this.user.git.name()} <${this.user.git.email()}>`
    });
  }
  install() {
    const { name } = this.args;
    const cwd = this.destinationPath(name);

    this.spawnCommandSync("rm", ["-rf", `.git`], { cwd });
    this.spawnCommandSync("git", ["init"], { cwd });
    this.spawnCommandSync("git", ["add", "."], { cwd });
    this.spawnCommandSync("git", ["commit", "-m", '"init repo"'], {
      cwd
    });

    this.yarnInstall(undefined, {}, { cwd });
  }
  end() {
    this.log(chalk.green("\n项目初始化成功!"));
    this.log(`  • 想要启动开发:  ${chalk.cyan.bold("yarn start")}`);
    this.log(`  • 想要开始构建:  ${chalk.cyan.bold("yarn build")}`);

    this.log("\n切换到项目目录");
    this.log(`${chalk.cyan("cd")} ${chalk.cyan(`./${this.args.name}`)}`);
  }
};
