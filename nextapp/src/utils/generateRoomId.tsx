const generateChatRoomId = (id1: string, id2: string) => {
  const sorted = [id1, id2].sort();
  return sorted.join("_");
}

export { generateChatRoomId }