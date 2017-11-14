export function webpackConfig(config, args) {
    const { defaultLoaders } = args;
    // Add .ts and .tsx extension to resolver
    config.resolve.extensions.push('.ts', '.tsx')

    // Add TypeScript Path Mappings (from tsconfig via webpack.config.js)
    // to react-statics alias resolution
    //config.resolve.alias = typescriptWebpackPaths.resolve.alias

    // We replace the existing JS rule with one, that allows us to use
    // both TypeScript and JavaScript interchangeably
    config.module.rules = [
        {
            oneOf: [
                {
                    test: /\.(js|jsx|ts|tsx)$/,
                    exclude: defaultLoaders.jsLoader.exclude, // as std jsLoader exclude
                    use: [
                        {
                            loader: 'babel-loader',
                        },
                        {
                            loader: require.resolve('ts-loader'),
                            options: {
                                transpileOnly: true,
                            },
                        },
                    ],
                },
                defaultLoaders.cssLoader,
                defaultLoaders.fileLoader,
            ],
        },
    ]
    return config
}