using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IARA.Persistence.Data.Entities;

[Index("PersonId", Name = "UQ__Inspecto__AA2FFBE4708C57E8", IsUnique = true)]
[Index("BadgeNumber", Name = "UQ__Inspecto__D110FD567045C85D", IsUnique = true)]
public partial class Inspector
{
    [Key]
    public int Id { get; set; }

    public int PersonId { get; set; }

    [StringLength(50)]
    public string BadgeNumber { get; set; } = null!;

    [InverseProperty("Inspector")]
    public virtual ICollection<Inspection> Inspections { get; set; } = new List<Inspection>();

    [ForeignKey("PersonId")]
    [InverseProperty("Inspector")]
    public virtual Person Person { get; set; } = null!;
}
