module.exports = {
  pluginOptions: {
    nodeIntegration: true,
    webSecurity: false,
    electronBuilder: {
      chainWebpackMainProcess: config => {
        // Chain webpack config for electron main process only
      },
      chainWebpackRendererProcess: config => {
        // Chain webpack config for electron renderer process only
        // The following example will set IS_ELECTRON to true in your app
        config.plugin('define').tap(args => {
          args[0]['IS_ELECTRON'] = true
          return args
        })
      },
      builderOptions: {
        appId: 'org.cybercards.cardinal',
        productName: 'Cardinal Scouting',
        copyright: 'Copyright \u00A9 2020 Calob Humble',
        win: {
          target: 'portable'
        }
      }
    }
  }
}