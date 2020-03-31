export default (times, callback) => {
  for (let i = 0; i < Number(times); i++) callback(i);
};
