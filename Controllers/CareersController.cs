﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using AccionLaboral.Models;
using Newtonsoft.Json;
using System.Web.Http.Cors;

namespace AccionLaboral.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class CareersController : ApiController
    {
        private AccionLaboralContext db = new AccionLaboralContext();

        public CareersController()
        {
            db.Database.CommandTimeout = 180;
        }
        // GET api/Careers
        [Route("api/Careers")]
        [HttpGet]
        public IQueryable<Career> GetCareers()
        {
            return db.Careers.Include("AcademicLevel");
        }

        // GET api/AcademicLevel/{AcademicLevelId}/Careers
        [Route("api/AcademicLevel/{AcademicLevelId}/Careers")]
        [HttpGet]
        public IQueryable<Career> GetCareers(int academicLevelId)
        {
            return db.Careers;
        }

        // GET api/Careers/5
        [ResponseType(typeof(Career))]
        public IHttpActionResult GetCareer(int id)
        {
            Career career = db.Careers.Find(id);
            if (career == null)
            {
                return NotFound();
            }

            return Ok(career);
        }

        // PUT api/Careers/5
        public IHttpActionResult PutCareer(int id, Career career)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != career.CareerId)
            {
                return BadRequest();
            }

            db.Entry(career).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CareerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST api/Careers
        [Route("api/Careers")]
        [HttpPost]
        [ResponseType(typeof(Career))]
        public IHttpActionResult PostCareer(Career career)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Careers.Add(career);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { controller = "careers", id = career.CareerId }, career);
        }

        // DELETE api/Careers/5
        [ResponseType(typeof(Career))]
        public IHttpActionResult DeleteCareer(int id)
        {
            Career career = db.Careers.Find(id);
            if (career == null)
            {
                return NotFound();
            }

            db.Careers.Remove(career);
            db.SaveChanges();

            return Ok(career);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CareerExists(int id)
        {
            return db.Careers.Count(e => e.CareerId == id) > 0;
        }
    }
}