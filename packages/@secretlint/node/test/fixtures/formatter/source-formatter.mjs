/**
 * A formatter that outputs the content of the sources via `getSource()`
 */
export default (results, { getSource }) => {
    return JSON.stringify(
        results.map((result) => {
            return {
                filePath: result.filePath,
                messageCount: result.messages.length,
                // JSON does not have undefined
                source: getSource(result.filePath) ?? null,
            };
        }),
    );
};
