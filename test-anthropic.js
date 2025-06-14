// Test file for Anthropic Claude API key detection with real examples
const API_KEY_03 =
    "sk-ant-api03-z0zjHHXo5uibD2havvfqiZYJe9ENlwI1trcQC4pyRC2N2w6nbpUitUU_iR4kkSszVyUpINaxvCtun3_Mub0O3w-48GXRgAA";

// This should be detected as a secret (api04)
export const ANTHROPIC_API_KEY =
    "sk-ant-api04-pRLEoxKCq2cuUW5bhgMTVPcAuDd6aoydZQYcEXVp_Fu46ri_GkPW5INiuAEYTqOx4w27CnqVik4Ak_wNjjzKAA-Q5uYbwAA";

// These should NOT be detected (various reasons)
const NOT_API_KEY = "sk-openai-123456"; // Different service
const FAKE_KEY = "sk-ant-api02-notarealkey"; // Wrong API version
const TYPO_KEY = "ssk-ant-api04-typo"; // Double 's' prefix
const WRONG_VERSION = "sk-ant-api05-alsowrong"; // Unsupported version
