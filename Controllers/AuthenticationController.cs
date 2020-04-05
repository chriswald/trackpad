using System;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.IO;
using System.Runtime.Caching;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Windows.Forms;
using Trackpad.Forms;

namespace Trackpad.Controllers
{
	public class ValidationRequest
	{
		[Required]
		public string Code { get; set; }
	}

	public class ValidationResponse
	{
		public bool Success { get; set; }

		public string AuthToken { get; set; }
	}

	[RoutePrefix("api/Auth")]
	public class AuthenticationController : ApiController
	{
		[HttpGet]
		[Route("BeginAuth")]
		public void BeginAuth()
		{
			ObjectCache cache = MemoryCache.Default;

			cache.Remove("AuthCode");
			StopCodeForm();
			cache.Remove("AuthToken");

			// Generate new token
			CacheItemPolicy policy = new CacheItemPolicy();
			policy.SlidingExpiration = new TimeSpan(0, 10, 0);

			string code = GenerateAuthCode();

			cache.Set("AuthCode", code, policy);

			RunCodeForm(code);
		}

		[HttpPost]
		[Route("Validate")]
		public ValidationResponse Authenticate(ValidationRequest request)
		{
			ObjectCache cache = MemoryCache.Default;
			string cacheCode = cache["AuthCode"] as string;

			if (!string.IsNullOrEmpty(cacheCode))
			{
				if (request.Code == cacheCode)
				{
					cache.Remove("AuthCode");
					StopCodeForm();

					ValidationResponse resp = new ValidationResponse();
					resp.Success = true;
					resp.AuthToken = GenerateAuthToken();

					CacheItemPolicy policy = new CacheItemPolicy();
					policy.SlidingExpiration = new TimeSpan(0, 10, 0);
					cache.Set("AuthToken", resp.AuthToken, policy);

					return resp;
				}
			}

			return new ValidationResponse() { Success = false, AuthToken = "" };
		}

		public static bool ValidateAuthToken(string tokenToCheck)
		{
			ObjectCache cache = MemoryCache.Default;
			string authToken = cache["AuthToken"] as string;

			if (authToken != null)
			{
				if (authToken == tokenToCheck)
				{
					return true;
				}
			}

			return false;
		}

		private string GenerateAuthCode()
		{
			return (new Random()).Next(0, 9999).ToString("0000");
		}

		private string GenerateAuthToken()
		{
			return (new Random()).Next(0, int.MaxValue).ToString();
		}

		private void RunCodeForm(string code)
		{
			CodeForm codeForm = new CodeForm(code);
			Task.Run(() =>
			{
				Application.Run(codeForm);
			});

			CacheItemPolicy policy = new CacheItemPolicy();
			policy.SlidingExpiration = new TimeSpan(0, 10, 0);

			ObjectCache cache = MemoryCache.Default;
			cache.Set("AuthCodeForm", codeForm, policy);
		}

		private void StopCodeForm()
		{
			ObjectCache cache = MemoryCache.Default;
			CodeForm codeForm = cache["AuthCodeForm"] as CodeForm;

			if (codeForm != null)
			{
				try
				{
					codeForm.Invoke(new Action(() =>
					{
						codeForm.Hide();
					}));
				}
				catch { }

				cache.Remove("AuthCodeForm");
			}
		}
	}
}