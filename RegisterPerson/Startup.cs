using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RegisterPerson.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Optimization;

namespace RegisterPerson
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            services.AddDbContext<Context>(options => options.UseSqlServer(Configuration.GetConnectionString("ConnectionDB")));

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseCookiePolicy();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Persons}/{action=Index}/{id?}");
            });
        }

        public static void RegisterBundles(BundleCollection bundles)
        {
            BundleTable.EnableOptimizations = true;

            // BASIC STYLES (LOGIN ONLY)
            bundles.Add(new StyleBundle("~/Styles/styles-base").Include(
                      "~/Contents/Styles/css/bootstrap.min.css",
                      "~/Contents/Styles/css/animate.css",
                      "~/Contents/Styles/css/font-awesome.css",
                      "~/Contents/Styles/css/p-loading.min.css",
                      "~/Contents/Styles/css/main.min.css"
                      ));

            // BASIC SCRIPTS
            bundles.Add(new ScriptBundle("~/Scripts/scripts-base").Include(
                      "~/Scripts/jQuery/jquery-3.1.1.min.js",
                      "~/Scripts/Bootstrap/bootstrap.min.js",
                      "~/Scripts/Bootstrap/bootstrap-notify/bootstrap-notify.min.js",
                      "~/Scripts/Bootstrap/bootbox/bootbox.min.js",
                      "~/Scripts/Bootstrap/bootstrap-admin-lte/app.min.js",
                      "~/Scripts/Lodash/lodash.min.js",
                      "~/Scripts/jQuery/jsonify.js",
                      "~/Scripts/Utility/utility.js",
                      "~/Scripts/Utility/moment.min.js",
                      "~/Scripts/Utility/p-loading.min.js",
                      "~/Scripts/Utility/knockout.js",
                      "~/Scripts/User/Login.js",
                      "~/Scripts/Utility/jsencrypt.min.js",
                      "~/Scripts/Utility/encryptSensitiveData.js",
                      "~/Scripts/Token/Token.js"
                      ));

            // CONTENT STYLES
            bundles.Add(new StyleBundle("~/Styles/styles-content").Include(
                    "~/Contents/Styles/css/bootstrap-admin-lte/AdminLTE.css",
                    "~/Contents/Styles/css/bootstrap-admin-lte/skins/_all-skins.min.css",
                    "~/Contents/Styles/css/bootstrap-datepicker/bootstrap-datepicker.min.css",
                    "~/Contents/Styles/css/bootstrap-select.min.css",
                    "~/Contents/Styles/css/icheck/skins/all.css",
                    "~/Contents/Styles/css/bootstrap-touchspin/jquery.bootstrap-touchspin.min.css"
                    ));

            // CONTENT SCRIPTS
            bundles.Add(new ScriptBundle("~/Scripts/scripts-content").Include(
                    "~/Scripts/jQuery/jquery.maskMoney.min.js",
                    "~/Scripts/jQuery/jquery.mask.min.js",
                    "~/Scripts/Bootstrap/bootstrap-admin-lte/app.min.js",
                    "~/Scripts/Bootstrap/bootstrap-datepicker/bootstrap-datepicker.min.js",
                    "~/Scripts/Bootstrap/bootstrap-datepicker/locates/bootstrap-datepicker.pt-BR.min.js",
                    "~/Scripts/Bootstrap/bootstrap-select/bootstrap-select.min.js",
                    "~/Scripts/Utility/navigation.js",
                    "~/Scripts/Bootstrap/bootstrap-touchspin/jquery.bootstrap-touchspin.js",
                    "~/Scripts/Utility/accounting.js"
                    ));

            // FORM SELECT EXTRA FEATURES
            bundles.Add(new ScriptBundle("~/Scripts/scripts-form-select").Include(
                    "~/Scripts/jQuery/jquery-ui.min.js",
                    "~/Scripts/Select2/select2.min.js"
                    ));

            bundles.Add(new StyleBundle("~/Styles/styles-form-select").Include(
                    "~/Contents/Styles/css/jquery-ui.min.css",
                    "~/Contents/Styles/css/select2.min.css"
                    ));
        }
    }
}
