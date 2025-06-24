module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
      "@babel/preset-env", // Adicionar o preset-env para transformar código moderno
      "@babel/preset-typescript", // Se você estiver usando TypeScript
      "module:react-native-dotenv"
    ],
    plugins: [
      ['module:react-native-dotenv', {
        moduleName:"@env",
        path:".env",
        blacklist:null,
        whitelist:null,
        safe:false,
        allowUndefined:true
      }]
    ],
  };
};
