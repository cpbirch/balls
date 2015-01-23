define(function () {

  function isBuilding(data) {
    return data.activity === 'building';
  }

  function isBroken(data) {
    return data.activity === 'sleeping' && data["last-build-status"] === 'failure';
  }

  function isNotGreen(data) {
    return isBroken(data) || isBuilding(data);
  }

  function isGreen(data) {
    return !isNotGreen(data);
  }


  function status(data) {
    return {
      isBuilding: isBuilding(data),
      isGreen: isGreen(data),
      isBroken: isBroken(data)
    };
  }

  return status;
})