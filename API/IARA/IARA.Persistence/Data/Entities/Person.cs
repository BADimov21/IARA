using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IARA.Persistence.Migrations;

[Index("EGN", Name = "IX_Persons_EGN")]
[Index("LastName", "FirstName", Name = "IX_Persons_LastName")]
[Index("EGN", Name = "UQ__Persons__C1902746ECAE8216", IsUnique = true)]
public partial class Person
{
    [Key]
    public int Id { get; set; }

    [StringLength(50)]
    public string FirstName { get; set; } = null!;

    [StringLength(50)]
    public string? MiddleName { get; set; }

    [StringLength(50)]
    public string LastName { get; set; } = null!;

    [StringLength(10)]
    [Unicode(false)]
    public string? EGN { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    [StringLength(200)]
    public string? Address { get; set; }

    [StringLength(20)]
    public string? PhoneNumber { get; set; }

    [InverseProperty("Person")]
    public virtual Inspector? Inspector { get; set; }

    [InverseProperty("Person")]
    public virtual ICollection<RecreationalCatch> RecreationalCatches { get; set; } = new List<RecreationalCatch>();

    [InverseProperty("Person")]
    public virtual ICollection<TELKDecision> TELKDecisions { get; set; } = new List<TELKDecision>();

    [InverseProperty("Person")]
    public virtual ICollection<TicketPurchase> TicketPurchases { get; set; } = new List<TicketPurchase>();

    [InverseProperty("Captain")]
    public virtual ICollection<Vessel> VesselCaptains { get; set; } = new List<Vessel>();

    [InverseProperty("Owner")]
    public virtual ICollection<Vessel> VesselOwners { get; set; } = new List<Vessel>();
}
