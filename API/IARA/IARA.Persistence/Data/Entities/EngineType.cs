using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IARA.Persistence.Migrations;

[Index("TypeName", Name = "UQ__EngineTy__D4E7DFA885E27956", IsUnique = true)]
public partial class EngineType
{
    [Key]
    public int Id { get; set; }

    [StringLength(50)]
    public string TypeName { get; set; } = null!;

    [Column(TypeName = "decimal(6, 2)")]
    public decimal AverageFuelConsumption { get; set; }

    [StringLength(20)]
    public string FuelUnit { get; set; } = null!;

    [InverseProperty("EngineType")]
    public virtual ICollection<Vessel> Vessels { get; set; } = new List<Vessel>();
}
