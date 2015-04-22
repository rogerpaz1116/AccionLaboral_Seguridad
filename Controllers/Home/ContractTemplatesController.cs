﻿using AccionLaboral.Models;
using Novacode;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AccionLaboral.Reports.Helpers;
using AccionLaboral.Helpers.Filters;

namespace AccionLaboral.Controllers.Home
{
    public class ContractTemplatesController : Controller
    {
        //
        // GET: /ContractTemplates/
        public ActionResult Index()
        {
            //return View();
            return new FilePathResult("~/Views/ContractTemplates/Index.html", "text/html");
        }

        //
        // GET: /ContractTemplates/Details/5
        public ActionResult Details(int id)
        {
            //return View();
            return new FilePathResult("~/Views/ContractTemplates/Detail.html", "text/html");
        }

        //
        // GET: /ContractTemplates/Create
        public ActionResult Create()
        {
            //return View();
            return new FilePathResult("~/Views/ContractTemplates/Create.html", "text/html");
        }

        //
        // POST: /ContractTemplates/Create
        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /ContractTemplates/Edit/5
        public ActionResult Edit(int id)
        {
            //return View();
            //return new FilePathResult("/Views/ContractTemplates/Edit.html", "text/html");
            return new FilePathResult("~/Views/ContractTemplates/Create.html", "text/html");
        }

        //
        // POST: /ContractTemplates/Edit/5
        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /ContractTemplates/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /ContractTemplates/Delete/5
        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        public ActionResult ContractReport()
        {
            return new FilePathResult("~/Views/Reports/ContractReport.html", "text/html");
        }

        [HttpGet]
        public ActionResult Download(string id)
        {
            string filename = id + ".docx";
            string path = AppDomain.CurrentDomain.BaseDirectory;
            string documentPath = path + "Reports\\" + filename;

            var bytes = System.IO.File.ReadAllBytes(documentPath);

            System.IO.File.Delete(documentPath);
            return File(bytes, "application/octet-stream", filename);
        }
    }
}
