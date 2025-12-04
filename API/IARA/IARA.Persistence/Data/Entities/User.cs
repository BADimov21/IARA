using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace IARA.Persistence.Data.Entities;

public class User : IdentityUser
{
    [Required]
    [MaxLength(50)]
    [Column(TypeName = "nvarchar(50)")]
    public string UserType { get; set; } = "User";

    [ForeignKey("Person")]
    public int? PersonId { get; set; }

    [Required]
    public bool IsActive { get; set; } = true;

    [Required]
    [Column(TypeName = "datetime2")]
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    [Column(TypeName = "datetime2")]
    public DateTime? LastLoginDate { get; set; }

    public virtual Person? Person { get; set; }
}
