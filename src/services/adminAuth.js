// Mesma condição das regras do Firestore: isAdmin() => request.auth.token.admin == true
export async function isAdminUser(user, forceRefresh = false) {
  if (!user) return false
  try {
    const { claims } = await user.getIdTokenResult(forceRefresh)
    return claims.admin === true
  } catch {
    return false
  }
}
