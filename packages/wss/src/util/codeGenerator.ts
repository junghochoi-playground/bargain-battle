function generateCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
  
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  
    return code;
  }
  

const generateRoomCode = () => {
    return generateCode()
}

const generateUserCode = () => {
    return 'user' + generateCode()
}

const generateSessionCode = () => {
    return 'npt-' + generateCode()
}


export { generateRoomCode, generateUserCode, generateSessionCode }