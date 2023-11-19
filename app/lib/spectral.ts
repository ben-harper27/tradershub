export async function getWalletRiskScores(walletAddress: string) {
  // Fetch risk score and risk profile from Spectral Finance API
  const spectralResponse = await fetch(
    `https://api.spectral.finance/api/v1/addresses/${walletAddress}/calculate_score`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SPECTRAL_API_KEY}`,
      },
      method: "POST",
    }
  );

  if (!spectralResponse.ok) {
    console.log(spectralResponse.statusText, {
      status: spectralResponse.status,
    });
  }
  const spectralScoreResponse = await fetch(
    `https://api.spectral.finance/api/v1/addresses/${walletAddress}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SPECTRAL_API_KEY}`,
      },
      method: "GET",
    }
  );

  if (!spectralScoreResponse.ok) {
    console.log(spectralResponse.statusText, {
      status: spectralResponse.status,
    });
  }

  const spectralData = await spectralScoreResponse.json();

  if (!spectralData) {
    console.log("No data from Spectral Finance API");
    return {};
  }

  return {
    riskScore: spectralData.score,
    riskLevel: spectralData.risk_level,
  };
}
