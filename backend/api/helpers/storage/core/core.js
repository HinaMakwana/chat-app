export const storageCore = async function (action, payload) {
  try {
    
    // Dynamically require the correct helper based on driver and action
    const helper = await import(`../${process.env.STORAGE_DRIVER}/${action}.js`);

    if (typeof helper[action] !== 'function') {
			return { isError: true, data: '' };
		}

		// Call the action and return result
		const result = await helper[action](payload);
    // Call the default export of the helper module
    // const result = await helper(payload);

    if (result.isError) {
      return { isError: true, data: result.data };
    }
    return { isError: false, data: result.data };
  } catch (error) {
    console.log('error in storage core helper', error);
    return { isError: true, data: error.message };
  }
};
