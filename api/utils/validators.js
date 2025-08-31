const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;

function validateUser({ name, address, email, password }) {
  if (!name || name.length < 20 || name.length > 60) {
    return "Name must be 20-60 characters.";
  }
  if (address && address.length > 400) {
    return "Address cannot exceed 400 characters.";
  }
  if (!emailRegex.test(email)) {
    return "Invalid email format.";
  }
  if (!passwordRegex.test(password)) {
    return "Password must be 8-16 chars, 1 uppercase, 1 special char.";
  }
  return null;
}

module.exports = { validateUser };
