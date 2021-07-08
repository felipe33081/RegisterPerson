using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RegisterPerson.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RegisterPerson.Controllers
{
    public class PersonsController : Controller
    {
        private readonly Context _context;

        public PersonsController(Context context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            return View(await _context.Persons.ToListAsync());
        }

        [HttpGet]
        public IActionResult CreatePerson()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> CreatePerson(Person person)
        {
            if (ModelState.IsValid)
            {
                _context.Add(person);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            else
            {
                return View(person);
            }
        }

        [HttpGet]
        public IActionResult UpdatePerson(int? id)
        {
            if (id != null)
            {
                Person person = _context.Persons.Find(id);
                return View(person);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPost]
        public async Task<IActionResult> UpdatePerson(int? id, Person person)
        {
            if (id != null)
            {
                if (ModelState.IsValid)
                {
                    _context.Update(person);
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index));
                }
                else
                {
                    return View(person);
                }
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet]
        public IActionResult RemovePerson(int? id)
        {
            if (id != null)
            {
                Person person = _context.Persons.Find(id);
                return View(person);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPost]
        public async Task<IActionResult> RemovePerson(int? id, Person person)
        {
            if (id != null)
            {
                _context.Remove(person);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            else
            {
                return NotFound();
            }
        }
    }
}
