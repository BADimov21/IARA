using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IARA.Persistence.Migrations;

[Index("TypeName", Name = "UQ__FishingG__D4E7DFA8723FC1DD", IsUnique = true)]
public partial class FishingGearType
{
    [Key]
    public int Id { get; set; }

    [StringLength(100)]
    public string TypeName { get; set; } = null!;

    [InverseProperty("GearType")]
    public virtual ICollection<FishingGear> FishingGears { get; set; } = new List<FishingGear>();
}
