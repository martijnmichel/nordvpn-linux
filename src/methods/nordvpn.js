const { exec } = require("child_process");
export async function getServers() {
  console.log("getting servers");

  const {
    stdout,
    stderr
  } = await exec("curl --silent https://api.nordvpn.com/server/stats", {
    shell: true
  });

  /*
  exec(
    "curl --silent https://api.nordvpn.com/server/stats",
    (error, stdout, stderr) => {
      if (stdout) {
        console.log("found severs");
        return stdout;
      } else if (error) {
        console.error(error);
      }
    }
  );
  */
}
