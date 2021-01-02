module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    '@babel/plugin-proposal-do-expressions',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-partial-application',
    [ '@babel/plugin-proposal-pipeline-operator', { 'proposal': 'minimal' } ],
    '@babel/plugin-proposal-throw-expressions'
  ]
}
