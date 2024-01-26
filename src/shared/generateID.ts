export function generateID() {
  // Gera um número aleatório entre 0 e 999999
  const numeroAleatorio = Math.floor(Math.random() * 1000000);

  // Converte o número para uma string de 6 caracteres
  let hash = numeroAleatorio.toString();

  // Remove os zeros à esquerda
  while (hash.length < 6) {
    hash = "0" + hash;
  }

  return hash;
}