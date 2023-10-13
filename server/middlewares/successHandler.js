const successHandler = (res, statusCode, data, length) => {
    const response = {
      message: "success",
      success: true,
      status: statusCode,
      ...(length && { results: length }),
      data,
    };
  
    res.status(statusCode).json(response);
  };
  
  export default successHandler;